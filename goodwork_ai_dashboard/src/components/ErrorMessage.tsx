interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-6 rounded relative text-center my-8">
      <h3 className="text-lg font-medium text-red-800">Load Error</h3>
      <p className="mt-2 text-red-700">{message}</p>
    </div>
  )
}
