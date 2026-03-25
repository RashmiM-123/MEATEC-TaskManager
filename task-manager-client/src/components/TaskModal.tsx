import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';

const TaskSchema = Yup.object().shape({
  title: Yup.string().min(3, 'Too short!').required('Title is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.string().oneOf(['todo', 'in-progress', 'completed']).required(),
});

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any; // If null, we are in "Create" mode
}

export const TaskModal = ({ isOpen, onClose, onSubmit, initialValues }: TaskModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {initialValues ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <Formik
          // If editing, use task data; otherwise, use empty defaults
          initialValues={initialValues || { title: '', description: '', status: 'todo' }}
          validationSchema={TaskSchema}
          // IMPORTANT: This allows Formik to reset when you switch between different tasks to edit
          enableReinitialize={true}
          onSubmit={(values) => {
            onSubmit(values);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <Field
                  name="title"
                  placeholder="What needs to be done?"
                  className={`w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 transition-all ${
                    errors.title && touched.title ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'
                  }`}
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-1 font-medium" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Add some details..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl h-28 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1 font-medium" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <Field
                  as="select"
                  name="status"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Field>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  {initialValues ? 'Update Task' : 'Save Task'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};