import { Box, Flex, Button, Heading, Image } from "@chakra-ui/react";
import Link from "next/link";

export interface GridProps {
  data: [string];
  url: string
}

const CoursesGrid: React.FC<GridProps> = ({ data, url}) => {
  return (
    <>
      <Flex w="100%" justify="center">
        <Flex
          mt="1rem"
          width="75%"
          wrap="wrap"
          justify={{ base: "center", sm: "space-between", md: "space-between" }}
        >
          {data.map((item) => {
            return (
              <Link
                href={`${url}/${item.replace(/\s/g, "-")}`}
                key={item}
              >
                <Flex
                  w={["100%", "45%", "45%", "23%"]}
                  bg="rgb(251 174 23)"
                  padding="0.8rem"
                  flexDirection="column"
                  mb="1rem"
                  key={item}
                  cursor="pointer"
                >
                  <Heading
                    m="auto"
                    size="lg"
                    align="center"
                    width="80%"
                    border="3px solid"
                  >
                    {item}
                  </Heading>
                </Flex>
              </Link>
            );
          })}
        </Flex>
      </Flex>
    </>
  );
};

export default CoursesGrid;
