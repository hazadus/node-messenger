import { Skeleton } from "@chakra-ui/react";
import React from "react";

type SkeletonLoaderProps = {
  count: number;
  height: string;
  width: string;
};

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count, height, width }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <Skeleton
          key={`skeleton-id-${index}`}
          width={width}
          height={height}
          mb={1}
          startColor="blackAlpha.400"
          endColor="whiteAlpha.300"
        ></Skeleton>
      ))}
    </>
  );
};

export default SkeletonLoader;
