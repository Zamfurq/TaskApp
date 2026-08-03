import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {logout} from '../store/authSlice'

export default function Navigation() {
    const loggedIn = useSelector((state) => state.auth.isLoggedIn)
    const dispatch = useDispatch()
    return (
        <nav className="flex items-center justify-between w-full h-16 py-2 text-black border-b px-28 mb-8 border-black-400">
            <Link to={loggedIn ? '/TaskList' : '/'} className="text-2xl font-medium text-black">
                TaskApp
            </Link>
            {loggedIn ? 
                <ul className="flex items-center h-16 text-xl">
                    <li><Link to='/' onClick={() => dispatch(logout())}>Logout</Link></li>
                </ul>
                :
                <ul className="flex items-center h-16 text-xl">
                    <li><Link to='/Register'>Register</Link></li>
                    <li className="pl-20"><Link to='/Login'>Login</Link></li>
                </ul>
            }
            
        </nav>
    )
}