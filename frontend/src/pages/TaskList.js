import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

const PAGE_SIZE = 10;

const TaskList = () => {
    const statuses = ["All","In-progress", "Pending", "Completed"]
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [status, setStatus] = useState(statuses[0]);
    const [page, setPage] = useState(1);
    const user = useSelector((state) => state.auth.user);
    const config = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem('token')
        },
        params: {username: user, status: (status === "All") ? null : status}
    };
    useEffect(() => {
        axios.get('http://localhost:7000/tasks', config)
        .then(res => {
            setTasks(res.data);
            setError('')
            setPage(1);
        }).catch(err => setError('Couldn\'t fetch tasks'))
    }, [user, status])

    const totalPages = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE));
    const paginatedTasks = tasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const deleteHandler = (taskID) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        axios.delete(`http://localhost:7000/tasks/${taskID}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
            params: {taskID}
        })
        .then(() => {
            const remaining = tasks.filter((t) => t.taskID !== taskID);
            setTasks(remaining);
            const remainingPages = Math.max(1, Math.ceil(remaining.length / PAGE_SIZE));
            if (page > remainingPages) setPage(remainingPages);
        })
        .catch(() => setError('Couldn\'t delete task'));
    }

    return (
        <Fragment>
            <div className="max-w-5xl mx-auto px-4 pt-5 pb-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl text-black">
                        Welcome, {user ? user : null}
                    </h1>
                    <Link to='/TaskUpsert' className='px-4 py-2 rounded-sm bg-blue-400 text-white hover:bg-blue-500'>
                        Create Task
                    </Link>
                </div>
                <select name="select" className='w-full h-8 p-1 mb-6 focus:outline-none' value={status} onChange={(e) => setStatus(e.target.value)}>
                    {statuses.map(function(n) {
                        return (<option value={n} key={n}>{n}</option>);
                    })}
                </select>

                {error ? <p className='mb-4 text-center text-red-600'>{error}</p> : null}

                <div className="overflow-x-auto rounded border border-neutral-200">
                    <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                        <thead className="border-b border-neutral-200 bg-neutral-100 font-medium dark:bg-neutral-700 dark:border-white/10">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Deadline</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTasks.length > 0 ? paginatedTasks.map((val, key) => {
                            return (
                                <tr className="border-b border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5" key={key}>
                                    <td className="px-4 py-3">{val.title}</td>
                                    <td className="px-4 py-3">{val.description}</td>
                                    <td className="px-4 py-3">{val.status}</td>
                                    <td className="px-4 py-3">{val.deadline}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link to={`/TaskUpsert/${val.taskID}`} className='px-3 py-1 rounded-sm bg-yellow-400 hover:bg-yellow-500'>Update</Link>
                                            <button className='px-3 py-1 rounded-sm bg-red-400 hover:bg-red-500' onClick={() => deleteHandler(val.taskID)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                            }) : (
                                <tr>
                                    <td className="px-4 py-6 text-center text-neutral-400" colSpan={5}>No tasks yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <button
                        className='px-3 py-1 rounded-sm bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-black">Page {page} of {totalPages}</span>
                    <button
                        className='px-3 py-1 rounded-sm bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </Fragment>
    )
}

export default TaskList;
