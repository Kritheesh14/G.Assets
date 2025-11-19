import { useParams } from 'react-router-dom';

export default function CategoryPage() {
  const { category } = useParams();
  return (
    <div>
      <h1>Category: {category}</h1>
      <p>Category stub</p>
    </div>
  );
}
