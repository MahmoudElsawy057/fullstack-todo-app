import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import { ChangeEvent, FormEvent, useState } from "react";
import Input from "./ui/Input";
import { ITodo } from "../interfaces";
import Textarea from "./ui/Textarea";
import axiosInstance from "../config/axios.config";
import TodoSkeleton from "./TodoSkelton";
import { faker } from "@faker-js/faker";

const TodoList = () => {
  const storageKey = "loggedinUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [queryVersion, setQueryVersion] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [todoToAdd, setTodoToAdd] = useState({
    title: "",
    description: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { data, isLoading } = useAuthenticatedQuery({
    queryKey: ["todos", `${queryVersion}`],
    url: "users/me?populate=todos",
    config: {
      headers: { Authorization: `Bearer ${userData.jwt}` },
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </div>
    );
  }

  // handlers
  const closeAddModalHandler = () => {
    setIsAddModalOpen(false);
    setTodoToAdd({
      title: "",
      description: "",
    });
  };

  const openAddModalHandler = () => {
    setIsAddModalOpen(true);
  };
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
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    });
  };
  const openConfirmModalHandler = (todo: ITodo) => {
    setIsConfirmModalOpen(true);
    setTodoToEdit(todo);
  };

  const removeTodoHandler = async () => {
    try {
      const { status } = await axiosInstance.delete(`/todos/${todoToEdit.id}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });
      if (status === 200) {
        closeConfiemModalHandler();
        setQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onAddChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // const { name, value } = e.target;
    setTodoToAdd({
      ...todoToAdd,
      [e.target.name]: e.target.value,
    });
  };
  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // const { name, value } = e.target;
    setTodoToEdit({
      ...todoToEdit,
      [e.target.name]: e.target.value,
    });
  };

  const generateTodosHandler = async () => {
    for (let i = 0; i < 100; i++) {
      try {
        const { data } = await axiosInstance.post(
          `/todos/`,
          {
            data: {
              title: faker.word.words(5),
              description: faker.lorem.paragraph(2),
              user: [userData.user.id],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${userData.jwt}`,
            },
          }
        );
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onSubmitAddHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { status } = await axiosInstance.post(
        `/todos/`,
        {
          data: {
            title: todoToAdd.title,
            description: todoToAdd.description,
            user: [userData.user.id],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      if (status === 200) {
        closeAddModalHandler();
        setQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
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
        setQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-1">
      <div className="w-fit mx-auto my-10">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-32 h-9 bg-gray-300 rounded-md dark:bg-gray-400"></div>
            <div className="w-32 h-9 bg-gray-300 rounded-md dark:bg-gray-400"></div>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button size={"sm"} onClick={openAddModalHandler}>
              Post new todo
            </Button>
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={generateTodosHandler}
            >
              Generate todos
            </Button>
          </div>
        )}
      </div>
      {data.todos.length ? (
        <div className="space-y-1 ">
          {data.todos.map((todo) => (
            <>
              <div
                key={todo.id}
                className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
              >
                <p className="w-full font-semibold">
                  {todo.id} - {todo.title}
                </p>
                <div className="flex items-center justify-end w-full space-x-3">
                  <Button size={"sm"} onClick={() => onOpenEditModal(todo)}>
                    Edit
                  </Button>
                  <Button
                    variant={"danger"}
                    size={"sm"}
                    onClick={() => openConfirmModal(todo)}
                  >
                    Remove
                  </Button>
                </div>{" "}
              </div>
            </>
          ))}
        </div>
      ) : (
        <h3>no todos found</h3>
      )}
      <Modal
        isOpen={isAddModalOpen}
        closeModal={closeAddModalHandler}
        title="Add New Todo"
      >
        <form className="space-y-3" onSubmit={onSubmitAddHandler}>
          <Input
            name="title"
            defaultValue={todoToAdd.title}
            onChange={onAddChangeHandler}
          />
          <Textarea
            name="description"
            defaultValue={todoToAdd.description}
            onChange={onAddChangeHandler}
          />
          <div className="flex items-center space-x-3 mt-4">
            <Button
              className="bg-indigo-700 hover:bg-indigo-800"
              isLoading={isUpdating}
            >
              Add
            </Button>
            <Button
              variant={"cancle"}
              onClick={closeAddModalHandler}
              type="button"
            >
              Cancle
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        closeModal={closeEditModalHandler}
        title="Edit Todo"
      >
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
            <Button
              variant={"cancle"}
              onClick={closeEditModalHandler}
              type="button"
            >
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
          <Button variant={"danger"} onClick={removeTodoHandler}>
            {" "}
            yes,remove
          </Button>
          <Button
            variant={"cancle"}
            onClick={closeConfiemModalHandler}
            type="button"
          >
            {" "}
            Cancle
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
