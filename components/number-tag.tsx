type TNumberTag = {
  number: number;
};

const NumberTag = ({ number }: TNumberTag) => {
  return (
    <span className="inline-flex px-2 min-w-8 h-8 flex-col justify-center items-center bg-wtf-function-brandBg rounded-full text-wtf-function-link text-xl font-medium">
      {number}
    </span>
  );
};

export default NumberTag;
