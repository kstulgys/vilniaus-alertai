import React, { useEffect, useState } from "react";
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

const SCOPE_MAP = {
  All: 0,
  Transportas: 1,
  Naujienos: 2,
  Aplinka: 3,
  Kultūra: 4,
  Sveikata: 5,
  "Socialinė apsauga": 6,
  Saugumas: 7,
  Švietimas: 8,
  Plėtra: 9,
  "Kita ": 10
};

export default function Index({ data, categories }) {
  const [isLoading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [currentCategory, setCategory] = useState(0);
  console.log({ currentCategory });
  console.log({ data });
  console.log({ searchResults });

  const handleSearchTerm = e => {
    // setSearchTerm(e.target.value);
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm) {
      const results = data.filter(item => {
        return item.alert_data.content.toLowerCase().includes(searchTerm);
      });
      setSearchResults(results);
    } else {
      setSearchResults(data);
    }
  };

  const handleCategoryPick = category => {
    const catId = SCOPE_MAP[category];
    setCategory(catId);
    console.log("handleCategoryPick() category:", catId);
  };
  useEffect(() => {
    // console.log({ currentCategory });
    // update the searchResults by
    // if (currentCategory !== 0) {
    // setLoading(true);
    getDataByCategory(currentCategory).then(dataByCategory => {
      console.log(`*********`);
      setSearchResults(dataByCategory);
      console.log({ dataByCategory });
    });
    // setLoading(false);
    // }

    // if (currentCategory === 0) {
    //   setSearchResults(data);
    // setLoading(false);
    // }
  }, [currentCategory]);

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
        <Box maxWidth="1280px" mx="auto" pt="16" px="4">
          <Flex>
            <Box width="25%">
              {categories.map(category => {
                return (
                  <Badge
                    key={category}
                    fontSize="md"
                    mx="2"
                    mb="3"
                    variantColor="purple"
                    onClick={() => handleCategoryPick(category)}
                  >
                    {category}
                  </Badge>
                );
              })}
            </Box>
            <Box flex="1" px="10">
              <Text fontFamily="inherit" color="purple.600" mb="4">
                Rasta:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {searchResults.length}
                </span>
              </Text>
              {!!searchResults.length &&
                searchResults.map(({ alert_data, create_date }) => {
                  return (
                    <Box key={create_date}>
                      <Text fontFamily="inherit" fontSize="lg">
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
      width="full"
      flexDirection="column"
      bg="blue.100"
      px="4"
      roundedBottomLeft="100px"
    >
      <Box ml="auto">
        <Text>Vilniaus Alertai</Text>
      </Box>
      <Flex alignItems="center" flexDirection="column" h="150px">
        <SearchInput handleSearchTerm={handleSearchTerm} />
      </Flex>
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
  const typeMap = {
    All: 0,
    Ispejimas: 1,
    Naujienos: 2
  };
  const scopeMap = {
    All: 0,
    Transportas: 1,
    Naujienos: 2,
    Aplinka: 3,
    Kultūra: 4,
    Sveikata: 5,
    "Socialinė apsauga": 6,
    Saugumas: 7,
    NA: 8,
    Plėtra: 9,
    Kita: 10
  };
  // create categories object
  const categoriesObj = data.reduce((acc, next) => {
    acc[next.alert_data.alert_scope] = true;
    return acc;
  }, {});
  // get categories array
  const categories = Object.keys(categoriesObj);

  return { categories, data };
  // create categories object
  // const categoriesArray = data.reduce((acc, next) => {
  //   const scopeName = next.alert_data.alert_scope;
  //   acc.push({ scopeName, id: scopeMap[scopeName] });
  //   return acc;
  // }, []);
  // // get categories array

  // const categories = [...categoriesArray, { scopeName: "All", id: 0 }];

  // get promises
  // let i = 1;
  // const resArray = [];
  // while (resArray.length <= 9 || i < 100) {
  //   const { data = [] } = await getDataByCategory(i);
  //   if (data.length >= 1) {
  //     resArray.push({ categoryName: data[0].alert_data.alert_scope, idx: i });
  //   }
  //   i++;
  // }

  //const resolved = await Promise.all(resArray);

  // const notEmptyResolved = resolved.map(messages => {
  //   const notEmptyMessages = messages.filter(m => m.alert_data.content);
  //   //return notEmptyMessages[0].alert_data.alert_type;
  //   return notEmptyMessages;
  // });
};

async function getDataByCategory(categoryNum) {
  console.log(`***************************`, categoryNum);
  // https://api.vilnius.lt/api
  // if (!categoryNum || categoryNum === 0) {
  //   const { data = [] } = await axios.get(
  //     "https://api.vilnius.lt/get-vilnius-gyvai/getmessages"
  //   );
  //   return data;
  // }
  const { data: res = [] } = await axios.get(
    `https://cors-anywhere.herokuapp.com/https://api.vilnius.lt/get-vilnius-gyvai/getmessages?scope=${categoryNum}`
  );
  console.log(res, `******`);
  return res;
}
