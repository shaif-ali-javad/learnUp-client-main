import Home from '../pages/Home'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router';

const HomeLayout = () => {



  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main >
        <Outlet></Outlet>
      </main>
      <footer>
        <Footer />
      </footer>
    </div >
  )
}

export default HomeLayout
