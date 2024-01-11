import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";

const TodoList = () => {
  const storageKey = "loggedinUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const { data, isLoading } = useAuthenticatedQuery({
    queryKey: ["todos"],
    url: "users/me?populate=todos",
    config: {
      headers: { Authorization: `Bearer ${userData.jwt}` },
    },
  });

  if (isLoading) {
    return <h3>Loading ...</h3>;
  }

  return data.todos.length ? (
    <div className="space-y-1 ">
      {data.todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
        >
          <p className="w-full font-semibold">{todo.title}</p>
          <div className="flex items-center justify-end w-full space-x-3">
            <Button size={"sm"}>Edit</Button>
            <Button variant={"danger"} size={"sm"}>
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <h3>no todos found</h3>
  );
};

export default TodoList;
