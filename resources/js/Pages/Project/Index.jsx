import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import Swal from "sweetalert2";


export default function Index({ auth, projects, queryParams = null, success }) {
  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }

    router.get(route("project.index"), queryParams, {
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

    router.get(route("project.index"), queryParams, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const deleteProject = (project) => {
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
        router.delete(route('project.destroy', project.id), {
          onSuccess: () => {
            Swal.fire(
              'Deleted!',
              `project "${project.name}" has been deleted.`,
              'success'
            )
          },
          onError: () => {
            Swal.fire(
              'Error!',
              'There was a problem deleting the project.',
              'error'
            )
          }
        });
      }
    });
  };


  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Projects
          </h2>
          <Link href={route("project.create")} className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
            Add New Project
          </Link>
        </div>
      }
      
    >
 
      <Head title="Projects" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {success && (
            <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
              {success}
            </div>
          )}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
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

                    <TableHeading name="name" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}  onSort={sortChanged}>
                      Name
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
                    <th className="px-3 py-2"></th>
                    <th className="px-3 py-2">
                      <TextInput
                        className="w-full"
                        placeholder="Project Name"
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
                  {projects.data.map((project) => (
                    <tr className="bg-white border-b" key={project.id}>
                      <td className="px-3 py-3">{project.id}</td>
                      <td className="px-3 py-3">
                        <img src={project.image_path} className="w-12" />
                      </td>
                      <th className="px-3 py-3 hover:underline text-nowrap">
                        <Link href={route('project.show',project.id)}>
                          {project.name}
                        </Link>
                      </th>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-1 rounded text-white ${
                            PROJECT_STATUS_CLASS_MAP[project.status]
                          }`}
                        >
                          {PROJECT_STATUS_TEXT_MAP[project.status]}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-nowrap">
                        {project.created_at}
                      </td>
                      <td className="px-3 py-3 text-nowrap">
                        {project.due_date}
                      </td>
                      <td className="px-3 py-3">{project.createdBy.name}</td>
                      <td className="px-3 py-3">
                        <Link
                          href={route("project.edit", project.id)}
                          className="font-medium text-blue-600 hover:underline mx-1"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={()=>deleteProject(project)}
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

            <Pagination links={projects.meta.links} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
