import { useQuery } from '@tanstack/react-query'



function App() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      return res.json();
    }
  })

  return (
    <div className="container mx-auto h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <h1 className="text-center text-4xl font-bold text-red-500 mb-6">
        Vite + React
      </h1>

      {isLoading ? (
        <p className="text-lg text-gray-700 animate-pulse">Loading...</p>
      ) : (
        <ul className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
          {data.map((post) => (
            <li
              key={post.id}
              className="py-2 px-4 border-b last:border-none text-gray-800 hover:bg-gray-100 transition"
            >
              {post.name}
            </li>
          ))}
        </ul>
      )}
    </div>

  )
}

export default App
