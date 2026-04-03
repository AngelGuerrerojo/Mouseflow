export default function MyComponent({ saludo,children}) {
    return (
        <div>
            {children} 
            <h1>hola {saludo}</h1>
             
        </div>
    )
}



