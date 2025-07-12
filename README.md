# FilmFuzz

FilmFuzz is a web-based application that allows users to upload photos and apply various grain filters and artifacts to achieve a retro or cinematic look. With a simple interface, users can customize grain intensity, size, and type, as well as add effects like light leaks, scratches, or vignettes.

## Features

- **Photo Upload**: Upload images in common formats (JPEG, PNG, etc.).
- **Grain Filters**: Apply different grain effects, including:
  - Fine Grain (subtle monochrome noise)
  - Coarse Grain (heavier monochrome noise)
  - Silver Halide (classic film-like grain)
  - Color Grain (RGB noise for vibrant effects)
  - Vintage Film (sepia-toned grain)
- **Artifacts**: Add imperfections to enhance the aesthetic:
  - Light Leaks (red-orange gradient overlays)
  - Scratches (random white lines)
  - Dust Specks (small black dots)
  - Vignette (darkened edges)
  - Bokeh (soft light spots)
- **Customization**: Adjust grain intensity and size using sliders.
- **Download**: Save the edited image as a PNG file with a celebratory confetti animation.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/makalin/filmfuzz.git
   ```
2. Navigate to the project directory:
   ```bash
   cd filmfuzz
   ```
3. Open `index.html` in a web browser to run the app locally. No server or dependencies are required, as the app uses vanilla HTML, CSS, and JavaScript with the `canvas-confetti` library hosted via CDN.

## Usage

1. Open the app in a browser.
2. Click the "Choose File" button to upload an image.
3. Select a grain type from the dropdown menu (e.g., Fine Grain, Vintage Film).
4. Optionally, select an artifact effect (e.g., Light Leaks, Scratches).
5. Adjust the grain intensity and size using the sliders.
6. Preview the effect in real-time on the canvas.
7. Click the "Download" button to save the edited image (a confetti animation will play).

## Project Structure

- `index.html`: Main HTML file with the app structure and canvas element.
- `styles.css`: Vanilla CSS for styling the interface.
- `script.js`: JavaScript for handling image uploads, applying grain and artifact effects, and downloading the result.
- Uses `canvas-confetti` (via CDN) for the download celebration effect.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request with a description of your changes.

Please ensure your code follows the project's coding style (vanilla JavaScript and CSS, no frameworks).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by retro photography and film aesthetics.
- Uses the `canvas-confetti` library for celebratory effects (https://github.com/catdad/canvas-confetti).
