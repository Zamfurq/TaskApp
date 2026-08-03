import { useSelector } from "react-redux";
import {Navigate, Outlet} from 'react-router-dom';

export default function Protected() {
    const token = useSelector((state) => state.auth.token)
    return token ? <Outlet /> : <Navigate to="/login" replace /> 

}