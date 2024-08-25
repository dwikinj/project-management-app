import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";


export default function Create({ auth, users, project }) {
  const { data, setData, post, errors } = useForm({
    name: "",
    description: "",
    status: "",
    priority: "",
    image_path: "",
    due_date: "",
    assigned_user_id:"",
    project_id: project.id,
  });

  const onSubmit = (e) => {
    e.preventDefault();

    post(route("task.store"));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Create New Task
          </h2>
        </div>
      }
    >
      <Head title="Tasks" />
     

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white shadow sm:rounded-lg"
            >
              <div>
              {data.image_path && data.image_path instanceof File  && (
                  <div className="mb-2">
                    <img 
                      src={typeof data.image_path === 'string' ? data.image_path : URL.createObjectURL(data.image_path)} 
                      alt="Task Image Preview" 
                      className="w-40 h-auto"
                    />
                  </div>
                )}
                <InputLabel
                  htmlFor="task_image_path"
                  value="Task Image"
                />
                <TextInput
                  id="task_image_path"
                  type="file"
                  name="image_path"
                  className="mt-1 block w-full"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setData("image_path", file || "");
                  }}                />
                <InputError message={errors.image_path} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="task_name" value="Task Name" />
                <TextInput
                  id="task_name"
                  type="text"
                  name="name"
                  value={data.name}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData("name", e.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel
                  htmlFor="task_description"
                  value="Task Descripton"
                />
                <TextAreaInput
                  id="task_description"
                  type="text"
                  name="description"
                  value={data.description}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("description", e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel
                  htmlFor="task_due_date"
                  value="Task Deadline"
                />
                <TextInput
                  id="task_due_date"
                  type="date"
                  name="due_date"
                  value={data.due_date}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData("due_date", e.target.value)}
                />
                <InputError message={errors.due_date} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="task_status" value="Task Status" />
                <SelectInput
                  id="task_status"
                  name="status"
                  value={data.status}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("status", e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </SelectInput>
                <InputError message={errors.status} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="task_priority" value="Task Priority" />
                <SelectInput
                  id="task_priority"
                  name="priority"
                  value={data.priority}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("priority", e.target.value)}
                >
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </SelectInput>
                <InputError message={errors.status} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="assigned_user" value="Assigned To" />
                <SelectInput
                  id="assigned_user"
                  name="assigned_user"
                  value={data.assigned_user_id}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("assigned_user_id", e.target.value)}
                >
                  <option value="">Select User</option>
                  {
                    users.map(user => (
                      <option value={user.id}>{user.name}</option>
                    ))
                  }

                </SelectInput>
                <InputError message={errors.status} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel
                  htmlFor="project_name"
                  value="Project Name"
                />
                <TextInput
                  id="project_name"
                  type="text"
                  name="project_name"
                  value={project.name}
                  className="mt-1 block w-full bg-gray-100 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"                  disabled
                />
              </div>


              <div className="mt-4 text-right">
                <Link
                  href={route("task.index")}
                  className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                >
                  Cancel
                </Link>
                <button className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
