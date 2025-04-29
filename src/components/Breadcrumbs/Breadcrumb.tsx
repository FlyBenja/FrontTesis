/**
 * Interface for Breadcrumb component props.
 */
interface BreadcrumbProps {
  pageName: string;
}

/**
 * Breadcrumb component.
 * 
 * This component displays a breadcrumb navigation element along with the current page title.
 * It is useful for providing users with a visual representation of their location within the app.
 * 
 */
const Breadcrumb = ({ pageName }: BreadcrumbProps): JSX.Element => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Page Title */}
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      {/* Breadcrumb Navigation */}
      <nav>
        <ol className="flex items-center gap-2">

          {/* Current Page */}
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
