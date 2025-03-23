import React from 'react'
import { useQuery } from '@tanstack/react-query'

const Home = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      return res.json();
    }
  })

  return (
    <div className="container mx-auto p-4 flex-column flex flex-col items-center h-screen bg-sky-900" >
      <h1 className="text-3xl font-bold mb-4 text-sky-300 ">Home</h1>

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

export default Home