import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import { ChangeEvent, FormEvent, useState } from "react";
import Input from "./ui/Input";
import { ITodo } from "../interfaces";
import Textarea from "./ui/Textarea";
import axiosInstance from "../config/axios.config";

const TodoList = () => {
  const storageKey = "loggedinUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { data, isLoading } = useAuthenticatedQuery({
    queryKey: ["todos", `${todoToEdit.id}`],
    url: "users/me?populate=todos",
    config: {
      headers: { Authorization: `Bearer ${userData.jwt}` },
    },
  });

  if (isLoading) {
    return <h3>Loading ...</h3>;
  }

  // handlers
  const closeEditModalHandler = () => {
    setIsEditModalOpen(false);
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    });
  };

  const openEditModalHandler = (todo: ITodo) => {
    setIsEditModalOpen(true);
    setTodoToEdit(todo);
  };

  const closeConfiemModalHandler = () => {
    setIsConfirmModalOpen(false);
  };
  const openConfirmModalHandler = () => {
    setIsConfirmModalOpen(true);
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // const { name, value } = e.target;
    setTodoToEdit({
      ...todoToEdit,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.name);
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { status } = await axiosInstance.put(
        `/todos/${todoToEdit.id}`,
        {
          data: {
            title: todoToEdit.title,
            description: todoToEdit.description,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      if (status === 200) {
        closeEditModalHandler();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      {data.todos.length ? (
        <div className="space-y-1 ">
          {data.todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
            >
              <p className="w-full font-semibold">{todo.title}</p>
              <div className="flex items-center justify-end w-full space-x-3">
                <Button size={"sm"} onClick={() => openEditModalHandler(todo)}>
                  Edit
                </Button>
                <Button
                  variant={"danger"}
                  size={"sm"}
                  onClick={openConfirmModalHandler}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h3>no todos found</h3>
      )}
      <Modal isOpen={isEditModalOpen} closeModal={closeEditModalHandler}>
        <form className="space-y-3" onSubmit={onSubmitHandler}>
          <Input
            name="title"
            defaultValue={todoToEdit.title}
            onChange={onChangeHandler}
          />
          <Textarea
            name="description"
            defaultValue={todoToEdit.description}
            onChange={onChangeHandler}
          />
          <div className="flex items-center space-x-3 mt-4">
            <Button
              className="bg-indigo-700 hover:bg-indigo-800"
              isLoading={isUpdating}
            >
              Update
            </Button>
            <Button variant={"cancle"} onClick={closeEditModalHandler}>
              Cancle
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={isConfirmModalOpen}
        closeModal={closeConfiemModalHandler}
        title="Are you sure you want to delete this"
        description="Deleting this todo will remove it permanently ,also any associated information will be lost"
      >
        <div className="flex items-center space-x-3">
          <Button variant={"danger"}> yes,remove</Button>
          <Button variant={"cancle"} onClick={closeConfiemModalHandler}>
            {" "}
            Cancle
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
