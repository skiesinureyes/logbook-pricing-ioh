import Sidebar from './Sidebar'

const MainLayout = ({ children }) => {
  return (
    <div style={styles.wrapper}>
      <Sidebar />
      <main style={styles.main}>
        {children}
      </main>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  main: {
    marginLeft: '64px',
    flex: 1,
    padding: '32px',
    minHeight: '100vh',
    overflow: 'auto'
  }
}

export default MainLayout