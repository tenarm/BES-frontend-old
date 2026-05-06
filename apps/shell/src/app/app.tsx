// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import NxWelcome from './nx-welcome';
import { Dashboard } from './dashboard';

export function App() {
  return (
    <div>
      <NxWelcome title="shell" />
      <Dashboard />
    </div>
  );
}

export default App;
