export function BackgroundBlur() {
  return (
    <>
      <div className="absolute top-[600px] md:top-[350px] right-[-300px] md:right-[-300px] w-[250px] md:w-[520px] h-[250px] md:h-[520px] aspect-square bg-[#3962CB] rounded-full blur-[200px] md:blur-[600px]" />
      <div className="absolute top-[300px] md:top-[900px] left-[-100px] md:left-[-400px] w-[250px] md:w-[520px] md:h-[520px] aspect-square bg-[#EA68AA] rounded-full blur-[200px] md:blur-[400px]" />
    </>
  );
}
