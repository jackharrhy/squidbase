import { useStore } from "./store";

export const App = () => {
  const socketState = useStore((state) => state.socketState);

  return (
    <div className="p-4 text-lg">
      <p>squidbase</p>
      <p>socket state: {socketState}</p>
    </div>
  );
};
