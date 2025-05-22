import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from "react-router"
//pages
import Home from "./pages/Home"
//layouts
import RootLayout from "./layouts/RootLayout"
//context

//all page routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
