import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import {
  ThemeProvider,
  CSSReset,
  Flex,
  Box,
  Text,
  Badge,
  Divider,
  Input,
  InputLeftElement,
  InputGroup,
  InputRightElement,
  Button,
  Icon
} from "@chakra-ui/core";
import axios from "axios";

export default function Index({ data, categories }) {
  const [searchResults, setSearchResults] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTerm = e => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm) {
      const results = data.filter(item => {
        return item.alert_data.content.includes(searchTerm);
      });
      setSearchResults(results);
    } else {
      setSearchResults(data);
    }
  }, [searchTerm, data]);

  return (
    <ThemeProvider>
      <CSSReset />
      <style jsx global>{`
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <Head>
        <title>Vilniaus alertai</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,800,900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header handleSearchTerm={handleSearchTerm} />
      <Box fontFamily="Montserrat" overflowY="hidden">
        <Box maxWidth="1280px" mx="auto" pt="10" px="4">
          <Flex>
            <Box width="25%">
              {categories.map(category => {
                return (
                  <Badge fontSize="md" mx="2" mb="3" variantColor="purple">
                    {category}
                  </Badge>
                );
              })}
            </Box>
            <Box flex="1" px="10">
              {searchResults.map(({ alert_data, create_date }) => {
                return (
                  <Box key={create_date}>
                    <Text fontSize="lg" fontFamily="inherit">
                      {alert_data.content}
                    </Text>
                    <Flex mt="2" alignItems="center">
                      <Box ml="auto">
                        <Text
                          color="gray.500"
                          fontSize="sm"
                          fontFamily="inherit"
                        >
                          {create_date}
                        </Text>
                      </Box>
                      <Badge
                        ml="4"
                        pt="1px"
                        fontSize="xs"
                        variantColor="purple"
                        fontFamily="inherit"
                      >
                        {alert_data.alert_scope}
                      </Badge>
                    </Flex>

                    <Divider my="6" />
                  </Box>
                );
              })}
            </Box>
            <Box width="25%">
              <Flex bg="gray.200" height="64" borderRadius="lg" />
            </Box>
          </Flex>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

function Header({ handleSearchTerm }) {
  return (
    <Flex
      h="64"
      bg="blue.100"
      roundedBottomLeft="100px"
      alignItems="center"
      flexDirection="column"
      px="4"
    >
      <SearchInput handleSearchTerm={handleSearchTerm} />
    </Flex>
  );
}

function SearchInput({ handleSearchTerm }) {
  return (
    <InputGroup my="auto" maxWidth="5xl" width="full" mx="auto">
      <InputLeftElement
        mt="6"
        pt="2"
        ml="6"
        children={<Icon name="search" color="gray.900" size="6" />}
      />

      <Input
        pl="20"
        height="24"
        boxShadow="md"
        borderRadius="lg"
        placeholder="Search"
        type="text"
        onChange={handleSearchTerm}
      />
      <InputRightElement width="48" height="16" mt="4" mr="4">
        <Button
          borderRadius="lg"
          width="full"
          height="full"
          bg="purple.600"
          color="white"
          _hover={{
            bg: "purple.500"
          }}
        >
          Search
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

Index.getInitialProps = async () => {
  const { data = [] } = await axios.get(
    "https://api.vilnius.lt/get-vilnius-gyvai/getmessages"
  );
  // create categories object
  const categoriesObj = data.reduce((acc, next) => {
    acc[next.alert_data.alert_scope] = true;
    return acc;
  }, {});
  // get categories array
  const categories = Object.keys(categoriesObj);

  return { categories, data };
};

// async function getData(){
//   const { data = [] } = await axios.get(
//     "https://api.vilnius.lt/get-vilnius-gyvai/getmessages"
//   );

//   return data
// }
