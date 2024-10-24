type TNumberTag = {
  number: number;
};

const NumberTag = ({ number }: TNumberTag) => {
  return (
    <span className="inline-flex px-2 min-w-8 h-8 flex-col justify-center items-center bg-wtf-brand-primary-light rounded-full text-wtf-content-link text-xl font-medium">
      {number}
    </span>
  );
};

export default NumberTag;
