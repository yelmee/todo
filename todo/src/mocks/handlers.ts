import {http, HttpResponse} from "msw"


let todos = [
    { id: 1, text: "Learn Vue 3", completed: false },
    { id: 2, text: "Learn TypeScript", completed: false },
    { id: 3, text: "Build an app", completed: false },
];

export const handlers = [
    http.get("https://api.example.com/user", () => {
        return HttpResponse.json({
            firstName: "John",
            lastName: "Maverick",
        });
    }),
    // List Todos
    http.get("https://api.example.com/todos", (req) => {
        const url = new URL(req.request.url);

        const query = url.searchParams.get("query");

        const filteredTodos = query
            ? todos.filter((todo) =>
                todo.text.toLowerCase().includes(query.toLowerCase())
            )
            : todos;

        return HttpResponse.json(filteredTodos);
    }),
    // Create Todo
    http.post("https://api.example.com/todos", async (req) => {
        const newTodo = (await req.request.json()) as {
            id: number;
            text: string;
            completed: boolean;
        };

        newTodo.id = Date.now();
        todos.push(newTodo);
        return HttpResponse.json(newTodo);
    }),
    // Update Todo
    http.put("https://api.example.com/todos/:id", async (req) => {
        const { id } = req.params;
        const updatedTodo = (await req.request.json()) as {
            text: string;
            completed: boolean;
        };

        todos = todos.map((todo) =>
            todo.id === Number(id) ? { ...todo, ...updatedTodo } : todo
        );
        return HttpResponse.json({ message: "Todo updated" });
    }),
    // Delete Todo
    http.delete("https://api.example.com/todos/:id", (req) => {
        const { id } = req.params;
        todos = todos.filter((todo) => todo.id !== Number(id));
        return HttpResponse.json({ message: "Todo deleted" });
    }),
];
