import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from "react-native";

import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const DetalleScreen = ({ route, navigation }) => {
  const novedad = route?.params?.novedad;

  if (!novedad) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.title}>Detalle de Novedad</Text>

        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No se recibió información de la novedad.
          </Text>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const eliminarNovedad = () => {
    Alert.alert( "Eliminar novedad", "¿Está seguro que desea eliminar esta novedad?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "novedades", novedad.id));

              Alert.alert( "Eliminado", "La novedad fue eliminada correctamente" );

              navigation.navigate("Historial");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la novedad");
              console.log(error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Detalle de Novedad</Text>
      <Text style={styles.subtitle}>Bitácora CCTV Bonanza</Text>

      <View style={styles.summaryCard}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{novedad.prioridad}</Text>
        </View>

        <Text style={styles.mainTitle}>{novedad.tipo}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Área</Text>
          <Text style={styles.infoValue}>{novedad.area}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Cámara</Text>
          <Text style={styles.infoValue}>{novedad.camara}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fecha</Text>
          <Text style={styles.infoValue}>{novedad.fecha}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hora</Text>
          <Text style={styles.infoValue}>{novedad.hora}</Text>
        </View>
      </View>

      <View style={styles.descriptionCard}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.descriptionText}>{novedad.descripcion}</Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} >
        <Text style={styles.buttonText}>Volver al Historial</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={eliminarNovedad}>
        <Text style={styles.buttonText}>Eliminar Novedad</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DetalleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 80,
  },

  emptyContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
    justifyContent: "center",
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
    marginTop: 5,
    marginBottom: 25,
  },

  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginBottom: 18,
  },

  badge: {
    backgroundColor: "#dbeafe",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },

  badgeText: {
    color: "#2563eb",
    fontSize: 13,
    fontWeight: "bold",
  },

  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 18,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 12,
    marginTop: 12,
  },

  infoLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },

  infoValue: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "600",
    maxWidth: "60%",
    textAlign: "right",
  },

  descriptionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
  },

  descriptionText: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 23,
  },

  backButton: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  deleteButton: {
    backgroundColor: "#dc2626",
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },

  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  emptyCard: {
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 18,
    elevation: 5,
    marginVertical: 20,
  },

  emptyText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
});