import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

const Settings = () => {
  return (
    <>
      <Breadcrumb pageName="Settings" />
      <div className="mx-auto max-w-5xl px-4 py-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark self-start">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Información Personal
              </h3>
            </div>
            <div className="p-4">
              <form action="#">
                <div className="mb-3">
                  <label htmlFor="fullName" className="block text-sm font-medium text-black dark:text-white">Nombre Completo</label>
                  <input type="text" name="fullName" id="fullName" defaultValue="Devid Jhon"
                         className="w-full rounded border border-stroke bg-gray py-2 px-4 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"/>
                </div>
                <div className="mb-3">
                  <label htmlFor="emailAddress" className="block text-sm font-medium text-black dark:text-white">Correo</label>
                  <input type="email" name="emailAddress" id="emailAddress" defaultValue="devidjond45@gmail.com"
                         disabled className="w-full rounded border border-stroke bg-gray-200 py-2 px-4 text-black dark:border-strokedark dark:bg-gray-600 dark:text-black"
                         style={{backgroundColor: '#f3f4f6'}}/>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="mb-3 flex-1">
                    <label htmlFor="role" className="block text-sm font-medium text-black dark:text-white">Rol</label>
                    <input type="text" name="role" id="role" defaultValue="Administrador" disabled
                           className="w-full rounded border border-stroke bg-gray-200 py-2 px-4 text-black dark:border-strokedark dark:bg-gray-600 dark:text-black"
                           style={{backgroundColor: '#f3f4f6'}}/>
                  </div>
                  <div className="mb-3 flex-1">
                    <label htmlFor="carnet" className="block text-sm font-medium text-black dark:text-white">Carnet</label>
                    <input type="text" name="carnet" id="carnet" defaultValue="xxxx-xx-xxxxx" disabled
                           className="w-full rounded border border-stroke bg-gray-200 py-2 px-4 text-black dark:border-strokedark dark:bg-gray-600 dark:text-black"
                           style={{backgroundColor: '#f3f4f6'}}/>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="bio" className="block text-sm font-medium text-black dark:text-white">BIO</label>
                  <textarea name="bio" id="bio" rows={3}
                            className="w-full rounded border border-stroke bg-gray py-2 px-4 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            placeholder="Escribe tu biografía aquí">Lorem ipsum dolor sit amet...</textarea>
                </div>
                <div className="flex justify-center mt-4">
                  <button type="submit" className="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark self-start">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Cambiar Contraseña
              </h3>
            </div>
            <div className="p-4">
              <form action="#">
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-black dark:text-white">Contraseña Actual</label>
                  <input type="password" name="currentPassword" id="currentPassword"
                         className="w-full rounded border border-stroke bg-gray py-2 px-4 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                         placeholder="********"/>
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-black dark:text-white">Nueva Contraseña</label>
                  <input type="password" name="newPassword" id="newPassword"
                         className="w-full rounded border border-stroke bg-gray py-2 px-4 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                         placeholder="********"/>
                </div>
                <div className="mb-3">
                  <label htmlFor="repeatPassword" className="block text-sm font-medium text-black dark:text-white">Repetir Contraseña</label>
                  <input type="password" name="repeatPassword" id="repeatPassword"
                         className="w-full rounded border border-stroke bg-gray py-2 px-4 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                         placeholder="********"/>
                </div>
                <div className="flex justify-center mt-4">
                  <button type="submit" className="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
