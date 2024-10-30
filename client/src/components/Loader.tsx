import FadeLoader from "react-spinners/FadeLoader";

export default function Loader() {
  return (
    <div className="flex items-center justify-center mt-4">
      <FadeLoader color="#7c7c7c" height={40} loading radius={43} width={7} />
    </div>
  );
}
