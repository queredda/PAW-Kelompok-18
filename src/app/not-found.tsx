import React from 'react'
import Image from "next/image";

const NotFound = () => {
  return (
    <div className="relative w-screen max-w-full h-[560px] bg-Background-A overflow-x-clip">
      <div className="flex flex-col justify-center items-center h-[560px] gap-y-[30px]">
        <div>
        <Image
          src="/logo/Logo.png"
          alt="rectangle"
          width={255}
          height={290}
          className="w-full h-auto m-0 block max-w-[204px]"
          priority
        />
        </div>
        <div className="flex flex-col gap-y-[0.8vw]">
          <h2 className="text-5xl font-semibold text-center text-white">
            404 Not Found
          </h2>
          <p className="w-1152px text-l font-extralight text-center text-white">
            Oops! Looks like you stumbled onto a broken link.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound
