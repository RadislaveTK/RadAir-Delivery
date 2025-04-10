export default function Main({children, ...props}) {

    return (
      <main className="main-container" {...props}>
        {children}
      </main>
    );
  }
  