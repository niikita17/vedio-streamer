This project is a video subscription platform designed to handle user authentication, subscription management, video uploads, and account management. The core features of the application include:
1.	User Registration and Login: Users can register and log in to their accounts, where authentication is handled using secure access tokens. Refresh tokens are used to manage session expiry, and password security is ensured through hashing.
2.	Subscription Management: Users have the ability to subscribe or unsubscribe to services, controlling their access to various videos. Subscriptions are managed through toggle mechanisms that update the user's status dynamically.
3.	Video and Media Uploads: Users can upload video content, as well as manage their avatars and cover images. All file uploads, including videos and images, are stored securely on cloud storage.
4.	Cloud Storage Integration: The application integrates cloud services for storing large files such as videos and media assets, ensuring scalable storage for user-generated content.
5.	User and Subscription Models: The system maintains detailed models for users, videos, and subscriptions, allowing for fine-tuned control over user accounts and their respective subscriptions.
6.	API Endpoints: The application includes several API endpoints to handle user registration, authentication, subscription toggling, and file uploads (for videos and media files).

