import { store } from "../../firebase/initFirebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import {
    Box,
    Heading,
    HStack,
    Icon,
    IconButton,
    ScrollView,
    Text,
    View,
    VStack,
    Badge,
    Divider,
    Image,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

export async function getServerSideProps(context) {
    return {
        props: {},
    };
}

export default function Extintor() {
    const router = useRouter();
    const id = router.query.id;
    const [revision, setRevision] = useState(null);

    useEffect(() => {
        getRevisionById(id);
    }, []);

    const dateFormat = (date) => {
        return (
            (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
            "/" +
            (date.getMonth() > 8
                ? date.getMonth() + 1
                : "0" + (date.getMonth() + 1)) +
            "/" +
            date.getFullYear()
        );
    };

    const knowEstatus = () => {
        let arr = [];
        for (const property in revision.extintor) {
            if (typeof revision.extintor[property] === "string") {
                // if (revision.extintor[property] == ["Regular" || "Malo" || "N/T"]) {
                if (
                    revision.extintor[property] == "Regular" ||
                    revision.extintor[property] == "Malo" ||
                    revision.extintor[property] == "N/T"
                ) {
                    arr.push(
                        ` ${property.replace(new RegExp("\\_", "g"), " ")}: ${
                            revision.extintor[property]
                        }`
                    );
                }
            }
        }
        return arr;
    };

    const getRevisionById = async (id) => {
        const docRef = doc(store, "revision_extintores", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            const revision_db = docSnap.data();

            const userRef = doc(store, "usuarios", revision_db.userId);
            const doc_user = await getDoc(userRef);
            const user_db = doc_user.data();

            const extintorRef = doc(store, "extintores", revision_db.extintor);
            const doc_extintor = await getDoc(extintorRef);
            const extintor_db = doc_extintor.data();

            setRevision({
                extintor: extintor_db,
                userId: user_db,
                ultima_modificacion: revision_db.ultima_modificacion,
            });
        } else {
            console.log("No such document!");
        }
    };

    return (
        <View>
            {revision !== null ? (
                <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
                    <ScrollView>
                        <Box p={2} w="95%" mx="auto">
                            {revision.userId !== null ? (
                                <HStack
                                    shadow={8}
                                    bg="blueGray.50"
                                    rounded={10}
                                    mt={3}
                                    justifyContent="center"
                                >
                                    {revision.userId && (
                                        <Image
                                            m={4}
                                            size={130}
                                            alt="userIdImg"
                                            borderRadius={100}
                                            source={{
                                                uri: revision.userId.img,
                                            }}
                                        />
                                    )}
                                    <VStack
                                        flex={1}
                                        alignItems="center"
                                        space={3}
                                    >
                                        <Heading
                                            mt={6}
                                            ml={2}
                                            size="xs"
                                            fontSize={23}
                                            bold
                                            textAlign="center"
                                        >
                                            {revision.userId.nombre}
                                        </Heading>
                                        <Text textAlign="center">
                                            {"Fecha revisión: " +
                                                dateFormat(
                                                    revision.ultima_modificacion.toDate()
                                                )}
                                        </Text>
                                    </VStack>
                                </HStack>
                            ) : (
                                <View></View>
                            )}
                            {revision.extintor !== null ? (
                                <VStack
                                    mt={5}
                                    shadow={8}
                                    bg="blueGray.100"
                                    rounded={10}
                                    mb={5}
                                >
                                    <HStack
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Heading
                                            mt={3}
                                            size="xs"
                                            fontSize={23}
                                            bold
                                            textAlign="center"
                                        >
                                            {"Extintor " +
                                                revision.extintor.codigo}
                                        </Heading>
                                        <Badge
                                            ml={2}
                                            mt={4}
                                            p={1}
                                            rounded={8}
                                            colorScheme="info"
                                            variant="subtle"
                                        >
                                            {revision.extintor.tipo_agente}
                                        </Badge>
                                    </HStack>

                                    {revision.extintor && (
                                        <Image
                                            alignSelf="center"
                                            m={4}
                                            size={200}
                                            alt="exrevision.extintorImg"
                                            borderRadius={20}
                                            source={{
                                                uri: revision.extintor.foto,
                                            }}
                                        />
                                    )}
                                    <View ml={5} mr={5} mb={5}>
                                        <Heading size="xs" fontSize={18} bold>
                                            Ubicación:
                                        </Heading>
                                        <Text>{`${revision.extintor.terminal}, ${revision.extintor.ubicacion}, ${revision.extintor.ubicacion_detallada}, ${revision.extintor.ubicacion_exacta}`}</Text>

                                        <Divider
                                            my={3}
                                            bg="primary.900"
                                            thickness="2"
                                        />

                                        <Heading size="xs" fontSize={18} bold>
                                            Fechas importantes:
                                        </Heading>
                                            <View>
                                                <HStack
                                                    my={2}
                                                    justifyContent="space-between"
                                                >
                                                    <Text fontSize={"sm"}>
                                                        Recarga o mantenimiento:
                                                    </Text>
                                                    <Badge colorScheme="success">
                                                        {dateFormat(
                                                            revision.extintor.fecha_recarga?.toDate()
                                                        )}
                                                    </Badge>
                                                </HStack>
                                                <HStack
                                                    my={2}
                                                    justifyContent="space-between"
                                                >
                                                    <Text fontSize={"sm"}>
                                                        Próxima recarga o
                                                        mantenimiento:
                                                    </Text>
                                                    <Badge colorScheme="yellow">
                                                        {dateFormat(
                                                            revision.extintor.fecha_proxima_recarga?.toDate()
                                                        )}
                                                    </Badge>
                                                </HStack>
                                                <HStack
                                                    my={2}
                                                    justifyContent="space-between"
                                                >
                                                    <Text fontSize={"sm"}>
                                                        Prueba hidrostática:
                                                    </Text>
                                                    <Badge colorScheme="success">
                                                        {dateFormat(
                                                            revision.extintor.fecha_prueba_hidrostatica?.toDate()
                                                        )}
                                                    </Badge>
                                                </HStack>
                                                <HStack
                                                    my={2}
                                                    justifyContent="space-between"
                                                >
                                                    <Text fontSize={"sm"}>
                                                        Próxima prueba
                                                        hidrostática:
                                                    </Text>
                                                    <Badge colorScheme="yellow">
                                                        {dateFormat(
                                                            revision.extintor.fecha_proxima_prueba_hidrostatica?.toDate()
                                                        )}
                                                    </Badge>
                                                </HStack>
                                            </View>

                                        <Divider
                                            my={3}
                                            bg="primary.900"
                                            thickness="2"
                                        />

                                        <Heading size="xs" fontSize={18} bold>
                                            Revisar:
                                        </Heading>
                                        <VStack>
                                            {knowEstatus().map((item) => {
                                                return (
                                                    <Text key={item}>
                                                        -{item}
                                                    </Text>
                                                );
                                            })}
                                        </VStack>

                                        <Divider
                                            my={3}
                                            bg="primary.900"
                                            thickness="2"
                                        />

                                        <Heading size="xs" fontSize={18} bold>
                                            Observaciones:
                                        </Heading>
                                        <Text fontSize={"sm"}>
                                            {revision.extintor.observaciones}
                                        </Text>
                                    </View>
                                </VStack>
                            ) : (
                                <View></View>
                            )}
                        </Box>
                    </ScrollView>
                </View>
            ) : (
                <Text>Cargando...</Text>
            )}
        </View>
    );
}
