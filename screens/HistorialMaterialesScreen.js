import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator} from "react-native";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const HistorialMaterialesScreen = ({ navigation }) => {
  const [materiales, setMateriales] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerMateriales = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "materiales"));

      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const listaOrdenada = lista.sort((a, b) => {
        return (b.timestamp || 0) - (a.timestamp || 0);
      });

      setMateriales(listaOrdenada);

    } catch (error) {
      console.error("Error al obtener materiales:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerMateriales();
  }, []);

  const renderMaterial = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("DetalleMaterial", { material: item })} >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>{item.categoria}</Text>
          <Text style={styles.cardSubtitle}>{item.tipoRegistro}</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {item.tipoRegistro === "Material Recibido" ? "Recibido" : "Enviado"}
          </Text>
        </View>
      </View>

      <View style={styles.line} />
      <Text style={styles.cardText}> Fecha: {item.fechaRegistro || "Sin fecha"} </Text>
      <Text style={styles.cardText}> Hora: {item.horaRegistro || "Sin hora"} </Text>
      <Text style={styles.cardHint}>Tocar para ver detalle</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Materiales</Text>
      <Text style={styles.subtitle}>Reportes operativos guardados</Text>

      {cargando ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Cargando registros...</Text>
        </View>
      ) : materiales.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sin reportes registrados</Text>
          <Text style={styles.emptyText}> Cuando registres material recibido o enviado, aparecerá en esta pantalla. </Text>
        </View>
      ) : (
        <FlatList
          data={materiales}
          keyExtractor={(item) => item.id}
          renderItem={renderMaterial}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default HistorialMaterialesScreen;

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

  listContent: {
    paddingBottom: 40,
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

  cardTitle: {
    fontSize: 19,
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

  cardText: {
    fontSize: 15,
    color: "#334155",
    marginTop: 4,
  },

  cardHint: {
    fontSize: 13,
    color: "#2563eb",
    marginTop: 12,
    fontWeight: "600",
  },
});