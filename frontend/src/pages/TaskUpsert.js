import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

const TaskUpsert = () => {

    const statuses = ["In-progress", "Pending", "Completed"]
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(statuses[0]);
    const [deadline, setDeadline] = useState('');
    const [error, setError] = useState('');

    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const { taskID } = useParams();

    

    useEffect(() => {
        if (!taskID) return;
        const config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
            params: {username: user}
        };
        axios.get('http://localhost:7000/tasks', config)
        .then(res => {
            const task = res.data.find(t => String(t.taskID) === taskID);
            if (!task) {
                setError('Task not found');
                return;
            }
            setTitle(task.title);
            setDescription(task.description);
            setStatus(task.status);
            setDeadline(task.deadline ? task.deadline.slice(0, 10) : '');
        })
        .catch(() => setError('Couldn\'t load task'));
    }, [taskID, user]);

    const submitHandler = (e) => {
        e.preventDefault();
        const config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
            params: {title, description, status, deadline, username: user, taskID}
        };

        const request = taskID
            ? axios.put(`http://localhost:7000/tasks/${taskID}`, {}, config)
            : axios.post('http://localhost:7000/tasks', {}, config);

        request
        .then(() => navigate('/TaskList'))
        .catch(() => setError(taskID ? 'Couldn\'t update task' : 'Couldn\'t create task'));
    }

    return (
        <form className='mx-auto border-2 p-9 md:p-12 w-72 md:w-96 border-black-400 mt-36 h-84' onSubmit={submitHandler}>
            <h3 className='pb-6 text-2xl text-left text-black'>{taskID ? 'Update Task' : 'Add Task'}</h3>
            <label className='block mb-1 text-xl text-black-400' htmlFor='title'>Title</label>
            <input className='w-full h-8 p-1 mb-6 focus:outline-none' id='title' type='text' value={title} onChange={(e) => setTitle(e.target.value)} required/>
            <label className='block mb-1 text-xl text-black-400' htmlFor='description'>Description</label>
            <input className='w-full h-8 p-1 mb-6 focus:outline-none' id='description' type='text' value={description} onChange={(e) => setDescription(e.target.value)} />
            <label className='block mb-1 text-xl text-black-400' htmlFor='status'>Status</label>
            <select name="select" className='w-full h-8 p-1 mb-6 focus:outline-none' value={status} onChange={(e) => setStatus(e.target.value)}>
                {statuses.map(function(n) {
                    return (<option value={n} key={n}>{n}</option>);
                })}
            </select>
            <label className='block mb-1 text-xl text-black-400' htmlFor='deadline'>Deadline</label>
            <input className='w-full h-8 p-1 mb-6 focus:outline-none' id='deadline' type='date' value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            <div className='flex justify-between'>
              <button className='px-3 py-1 rounded-sm bg-blue-400' type='submit'>{taskID ? 'Update' : 'Submit'}</button>
            </div>
            {error ? <p className='pt-10 text-center text-red-600'>{error}</p> : null}
        </form>
    )
}

export default TaskUpsert;
