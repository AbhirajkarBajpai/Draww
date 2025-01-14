# Draww

**Draww** is an interactive and creative game Build on NextJS. It provides a fun and engaging way to challenge friends by creating and solving drawing-based puzzles.

## Features

### Two Modes of Play
1. **Challenge Creation**
   - The first player selects a word and creates a drawing based on that word.
   - After submitting, a sequence video of the drawing process is generated, along with the final image, and stored in the backend.
   - A unique challenge link is created for sharing.

2. **Challenge Play**
   - The second player opens the challenge link.
   - They watch the drawing video and attempt to guess the word depicted in the drawing.

### Drawing Board Functionality
- **Drawing Tools**:
  - Draw with multiple colors.
  - Eraser for corrections.
  - Undo the last step.
  - Delete all drawing on the board.
  - Fill selected areas with color.
- **Video Recording**:
  - Captures only the user’s interactions with the board.
  - Helps the second player analyze the drawing process and make their guess.

## Technologies Used

### Frontend
- **Next.js**: For a seamless, responsive, and interactive user interface.
- **Canvas**: Enables intuitive and feature-rich drawing capabilities.

### Backend
- **Express**: To manage APIs and application logic.

### File Storage
- **AWS S3**: Securely stores drawing videos and images.

### Database
-**MongoDB**: For relevant data storage regarding challenges.

## Future Enhancements

- Adding real-time multiplayer support for simultaneous drawing and guessing.

- Enabling drawing hints for the second player.

## Contributing

Contributions are welcome! If you have any Idea , contact me at abhirajkarbajpai2707@gmail.com.