
import ProjectsTable from './ProjectsTable';
import classes from './UserProject.module.css';

const UserProjectTable = () => {
  return (
    <section className={classes.profile}>
      <h1>Projects</h1>
      <ProjectsTable />
    </section>
  );
};

export default UserProjectTable;
