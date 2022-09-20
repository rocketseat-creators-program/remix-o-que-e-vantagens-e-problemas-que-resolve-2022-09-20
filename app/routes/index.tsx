import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { TodoService } from "service/TodoService";

const todoService = new TodoService();

export const action: ActionFunction = async ({ request }) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const data = new URLSearchParams(await request.text());

  const title = data.get("title");

  if (!title) {
    return json({ error: "Title is required" }, { status: 400 });
  }

  const todo = todoService.add(title);

  return json({ todo });
};

export const loader = () => {
  return json({
    todos: todoService.getAll(),
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const transition = useTransition();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Todo List</h1>

      <ul>
        {data.todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <Form method="post">
        <input required name="title" type="text" />

        {transition.state === "submitting" ? (
          <button disabled>Loading...</button>
        ) : (
          <button type="submit">Add</button>
        )}
      </Form>
    </div>
  );
}
