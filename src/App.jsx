import Clock from "./components/Clock"
import { Helmet } from "react-helmet-async";


function App() {
  return (
    <>
    <Helmet>
  <title>25 + 5 Clock – Free and Easy-to-Use Pomodoro Timer</title>
  <meta
    name="description"
    content="Simple and customizable 25 + 5 Pomodoro timer to boost your productivity. Manage your work and break sessions with an interactive and easy-to-use online timer."
  />
  <meta
    name="keywords"
    content="Pomodoro timer, 25 + 5 clock, productivity timer, online Pomodoro, work timer, study timer, time management, break timer"
  />
  <meta name="author" content="Juan Sebastián Suárez" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</Helmet>
    <Clock />
    </>
  )
}

export default App
