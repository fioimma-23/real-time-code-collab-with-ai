import React from 'react';

type Props = {
  name: string;
};

const Welcome: React.FC<Props> = ({ name }) => {
  return <h2>Welcome, {name}!</h2>;
};

function App() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>React + TypeScript App</h1>
      <Welcome name="YourName" />
    </div>
  );
}

export default App;
