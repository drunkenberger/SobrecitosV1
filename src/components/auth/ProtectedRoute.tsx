import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { AuthDialog } from './AuthDialog';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // TEMPORARY: Disable authentication for testing
  console.log("ProtectedRoute: Authentication disabled for testing - allowing access");
  return <>{children}</>;
  
  /* ORIGINAL CODE - COMMENTED OUT FOR TESTING
  const { user, loading, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    // Si no estamos cargando y no hay usuario, mostrar el diálogo de autenticación
    if (!loading && !user) {
      console.log("ProtectedRoute: No user detected, showing auth dialog");
      setShowAuthDialog(true);
    } else if (user) {
      console.log("ProtectedRoute: User authenticated:", user.email);
    }
  }, [user, loading]);

  // Si estamos cargando, mostrar un indicador de carga
  if (loading) {
    console.log("ProtectedRoute: Loading user state...");
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si el usuario está autenticado, mostrar el contenido protegido
  if (user) {
    console.log("ProtectedRoute: Rendering protected content for user:", user.email);
    return <>{children}</>;
  }

  // Si no hay usuario y no estamos mostrando el diálogo de autenticación,
  // redirigir a la página de inicio
  if (!showAuthDialog) {
    console.log("ProtectedRoute: No auth dialog and no user, redirecting to home");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Mostrar el diálogo de autenticación
  console.log("ProtectedRoute: Showing auth dialog");
  return (
    <>
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={(open) => {
          console.log("ProtectedRoute: Auth dialog open state changed to:", open);
          setShowAuthDialog(open);
          // Si el usuario cierra el diálogo sin autenticarse, redirigir a la página de inicio
          if (!open && !user) {
            console.log("ProtectedRoute: Dialog closed without auth, redirecting to home");
            window.location.href = '/';
          }
        }}
        onSuccess={async () => {
          console.log("ProtectedRoute: Auth success callback triggered");
          // Make sure user state is refreshed
          await refreshUser();
          console.log("ProtectedRoute: User refreshed after auth");
          setShowAuthDialog(false);
          
          // Force a re-render to show the protected content
          // We can use the current path to effectively reload the current route
          const currentPath = location.pathname;
          console.log("ProtectedRoute: Navigating to current path:", currentPath);
          navigate(currentPath);
        }}
      />
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    </>
  );
  */
} 