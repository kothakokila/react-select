import React, { useState, useContext, useReducer } from 'react';

// Define the initial state and reducer for form fields
const initialState = [];
const formReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_FIELD':
      return [...state, action.payload];
    case 'UPDATE_FIELD':
      return state.map(field => field.id === action.payload.id ? action.payload : field);
    default:
      return state;
  }
};

// Context for form state
const FormContext = React.createContext();

const FormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};

// Form Designer Component
const FormDesigner = () => {
  const { state, dispatch } = useContext(FormContext);
  const addField = (type) => {
    dispatch({
      type: 'ADD_FIELD',
      payload: { id: Date.now(), type, label: '', placeholder: '', required: false }
    });
  };
  return (
    <div>
      <button onClick={() => addField('text')}>Add Text Field</button>
      <button onClick={() => addField('email')}>Add Email Field</button>
      {state.map(field => (
        <div key={field.id}>
          <input 
            type="text" 
            value={field.label} 
            onChange={(e) => dispatch({ type: 'UPDATE_FIELD', payload: { ...field, label: e.target.value }})}
            placeholder="Label"
          />
        </div>
      ))}
    </div>
  );
};

// Form Renderer Component
const FormRenderer = () => {
  const { state } = useContext(FormContext);
  return (
    <form>
      {state.map(field => (
        <div key={field.id}>
          <label>{field.label}</label>
          <input type={field.type} placeholder={field.placeholder} required={field.required} />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

const App = () => (
  <FormProvider>
    <div>
      <h1>Dynamic Form Builder</h1>
      <FormDesigner />
      <FormRenderer />
    </div>
  </FormProvider>
);

export default App;
