const router = createBrowserRouter([
  {
    element: <ErrorBoundaryWrapper>
      <AppLayout />
    </ErrorBoundaryWrapper>,
    errorElement: <ErrorBoundaryWrapper>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Try again
          </button>
        </div>
      </div>
    </ErrorBoundaryWrapper>,
    children: [
      {
        element: <NavbarLayout />,
        errorElement: <ErrorBoundaryWrapper><NavbarLayout /></ErrorBoundaryWrapper>,
        children: [
          { 
            path: '/', 
            element: <ErrorBoundaryWrapper><MainView /></ErrorBoundaryWrapper>,
          },
          { 
            path: '/login', 
            element: <ErrorBoundaryWrapper><LoginView /></ErrorBoundaryWrapper>,
          },
          { 
            path: '/playground', 
            element: <ErrorBoundaryWrapper><PlaygroundView /></ErrorBoundaryWrapper>,
          },
        ]
      },
      { 
        path: '/create', 
        element: <ErrorBoundaryWrapper><CreateBook /></ErrorBoundaryWrapper>,
      },
      { 
        path: '/gallery', 
        element: <ErrorBoundaryWrapper><GalleryView /></ErrorBoundaryWrapper>,
      },
      { 
        path: '/test', 
        element: <ErrorBoundaryWrapper><PlaygroundView /></ErrorBoundaryWrapper>,
      },
    ]
  }
]); 