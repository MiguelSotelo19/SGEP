import '../screens/css/login.css';

export const Circulos = ({ children }) => {
  return (
    <div className="circulos">
      <i style={{ "--clr": "#ADD8E6" }}></i>
      <i style={{ "--clr": "#4ad2ff" }}></i>
      <i style={{ "--clr": "#2294f3" }}></i>
      {children}
    </div>
  );
};
