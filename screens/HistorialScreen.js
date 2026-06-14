import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator} from "react-native";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const HistorialScreen = ({ navigation }) => {
  const [novedades, setNovedades] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerNovedades = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "novedades"));

      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const listaOrdenada = lista.sort((a, b) => {
        return (b.timestamp || 0) - (a.timestamp || 0);
      });

      setNovedades(listaOrdenada);
    } catch (error) {
      console.error("Error al obtener novedades: ", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerNovedades();
  }, []);

  const renderNovedad = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Detalle", { novedad: item })} >
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.tipo}</Text>
          <Text style={styles.cardSubtitle}>{item.area}</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.prioridad}</Text>
        </View>
      </View>

      <View style={styles.line} />

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Cámara</Text>
        <Text style={styles.detailValue}>{item.camara}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Fecha</Text>
        <Text style={styles.detailValue}> {item.fecha} - {item.hora} </Text>
      </View>

      <Text style={styles.cardHint}>Tocar para ver detalle</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Novedades</Text>
      <Text style={styles.subtitle}>Bitácora CCTV Bonanza</Text>

      {cargando ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Cargando novedades...</Text>
        </View>
      ) : novedades.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sin novedades registradas</Text>
          <Text style={styles.emptyText}> Cuando registres una novedad, aparecerá en esta pantalla. </Text>
        </View>
      ) : (
        <FlatList
          data={novedades}
          keyExtractor={(item) => item.id}
          renderItem={renderNovedad}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default HistorialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 25,
  },

  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#64748b",
  },

  listContent: {
    paddingBottom: 40,
  },

  emptyCard: {
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 18,
    elevation: 5,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 10,
  },

  emptyText: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 18,
    elevation: 5,
    marginBottom: 16,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardInfo: {
    flex: 1,
    paddingRight: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },

  badge: {
    backgroundColor: "#dbeafe",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2563eb",
  },

  line: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 14,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  detailLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },

  detailValue: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
  },

  cardHint: {
    fontSize: 13,
    color: "#2563eb",
    marginTop: 14,
    fontWeight: "600",
  },
});