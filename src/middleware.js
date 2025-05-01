import { withAuth } from "next-auth/middleware"


export default withAuth({
    pages: {
        signIn: '/', // Redirect to landing page if not authenticated
    },
})

export const config = {
    matcher: ['/enterIngredients', '/viewsavedrecipes'] // Add more protected routes here
};