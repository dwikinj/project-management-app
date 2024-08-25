import TableHeading from "@/Components/TableHeading";
import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { TASK_PRIORITY_CLASS_MAP, TASK_PRIORITY_TEXT_MAP, TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants";
import { Link, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";


export default function TasksTable({tasks, queryParams = null, hideProjectColumn = false}) {
    queryParams = queryParams || {};
    const { url } = usePage(); 

    const searchFieldChanged = (name, value) => {
        if (value) {
          queryParams[name] = value;
        } else {
          delete queryParams[name];
        }
    
        router.get(url, queryParams, {
          preserveState: true,
          preserveScroll: true,
        });
      };
    
      const onKeyPress = (name, e) => {
        if (e.key !== "Enter") return;
    
        searchFieldChanged(name, e.target.value);
      };
    
      const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
          if (queryParams.sort_direction === "asc") {
            queryParams.sort_direction = "desc";
          } else {
            queryParams.sort_direction = "asc";
          }
        } else {
          queryParams.sort_field = name;
          queryParams.sort_direction = "asc";
        }
    
        router.get(url, queryParams, {
          preserveState: true,
          preserveScroll: true,
        });
        
      };

      const deleteTask = (task) => {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            router.delete(route('task.destroy', task.id), {
              onSuccess: () => {
                Swal.fire(
                  'Deleted!',
                  `task "${task.name}" has been deleted.`,
                  'success'
                )
              },
              onError: () => {
                Swal.fire(
                  'Error!',
                  'There was a problem deleting the task.',
                  'error'
                )
              }
            });
          }
        });
      };
    return (
        <>
       
            <div className="overflow-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b-2">
                    <tr className="text-nowrap">
                        <TableHeading name="id" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}  onSort={sortChanged}>
                        ID
                        </TableHeading>
                        <TableHeading sortable={false}>
                            Image
                        </TableHeading>

                        {!hideProjectColumn && <TableHeading sortable={false}>
                            Project Name
                        </TableHeading>}

                        <TableHeading name="name" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}  onSort={sortChanged}>
                            Name
                        </TableHeading>
                        
                        <TableHeading name="priority" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}  onSort={sortChanged}>
                            Priority
                        </TableHeading>
                        <TableHeading name="status" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}  onSort={sortChanged}>
                            Status
                        </TableHeading>
                        <TableHeading name="created_at" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}  onSort={sortChanged}>
                            Created Date
                        </TableHeading>

                        <TableHeading name="due_date" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}  onSort={sortChanged}>
                            Due Date
                        </TableHeading>

                        <TableHeading sortable={false}>
                            Assigned To
                        </TableHeading>
                        <TableHeading sortable={false}>
                            Created By
                        </TableHeading>
                        <TableHeading sortable={false}>
                            Actions
                        </TableHeading>
                    </tr>
                    </thead>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b-2">
                    <tr className="text-nowrap">
                        <th className="px-3 py-2"></th>
                        {!hideProjectColumn && <th className="px-3 py-2"></th>}
                        <th className="px-3 py-2"></th>
                        <th className="px-3 py-2">
                        <TextInput
                            className="w-full"
                            placeholder="Task Name"
                            defaultValue={queryParams.name}
                            onBlur={(e) =>
                            searchFieldChanged("name", e.target.value)
                            }
                            onKeyPress={(e) => onKeyPress("name", e)}
                        />
                        </th>
                        <th className="px-3 py-2">
                        <SelectInput
                            className="w-full"
                            defaultValue={queryParams.status}
                            onChange={(e) =>
                            searchFieldChanged("priority", e.target.value)
                            }
                        >
                            <option value="">Select Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </SelectInput>
                        </th>
                        <th className="px-3 py-2">
                        <SelectInput
                            className="w-full"
                            defaultValue={queryParams.status}
                            onChange={(e) =>
                            searchFieldChanged("status", e.target.value)
                            }
                        >
                            <option value="">Select Status</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </SelectInput>
                        </th>
                        <th className="px-3 py-2"></th>
                        <th className="px-3 py-2"> </th>
                        <th className="px-3 py-2"> </th>
                        <th className="px-3 py-2"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.data.map((task) => (
                        <tr className="bg-white border-b" key={task.id}>
                        <td className="px-3 py-3">{task.id}</td>
                        <td className="px-3 py-3">
                            <img src={task.image_path} className="w-12" />
                        </td>
                        {!hideProjectColumn && <td className="px-3 py-3">{task.project.name}</td>}
                        <td className="px-3 py-3 hover:underline">
                            <Link href={route("task.show",task.id)}>
                                {task.name}
                             </Link>
                        </td>
                        <td className="px-3 py-3">
                            <span
                            className={`px-2 py-1 rounded text-white ${
                                TASK_PRIORITY_CLASS_MAP[task.priority]
                            }`}
                            >
                            {TASK_PRIORITY_TEXT_MAP[task.priority]}
                            </span>
                        </td>
                        <td className="px-3 py-3">
                            <span
                            className={`px-2 py-1 rounded text-white ${
                                TASK_STATUS_CLASS_MAP[task.status]
                            }`}
                            >
                            {TASK_STATUS_TEXT_MAP[task.status]}
                            </span>
                        </td>
                        <td className="px-3 py-3 text-nowrap">
                            {task.created_at}
                        </td>
                        <td className="px-3 py-3 text-nowrap">
                            {task.due_date}
                        </td>
                        <td className="px-3 py-3">{task.assignedUser.name}</td>
                        <td className="px-3 py-3">{task.createdBy.name}</td>
                        <td className="px-3 py-3">
                            <Link
                            href={route("task.edit", task.id)}
                            className="font-medium text-blue-600 hover:underline mx-1"
                            >
                            Edit
                            </Link>
                            <button
                            onClick={() => deleteTask(task)}
                            className="font-medium text-red-600 hover:underline mx-1"
                            >
                            Delete
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Pagination links={tasks.meta.links} />
        </>
    );
}