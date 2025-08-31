/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        mongoDB:'mongodb+srv://monidhillon983_db_user:K8ZYR5iRwTbN5cWs@cluster0.dohomtc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        JWT_SECRET:'admin123',
        CLOUDINARY_CLOUD_NAME:'dt1vxjl7w',
        CLOUDINARY_API_KEY:'324291124925823',
        CLOUDINARY_API_SECRET:'5efVMujr77UXczJsWUcNLBrdpoA'
    }
};

export default nextConfig;
