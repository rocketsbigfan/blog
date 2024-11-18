import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ImageWithZoom = ({ src, alt }) => (
  <Zoom
    wrapElement='span'
    classDialog='md-dialog'
  >
    <img src={src} alt={alt} />
  </Zoom>
);

export default ImageWithZoom;