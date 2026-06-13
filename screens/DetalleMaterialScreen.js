import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share, Vibration, Alert} from "react-native";

import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const DetalleMaterialScreen = ({ route, navigation }) => {
  const material = route?.params?.material;

  if (!material) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.title}>Detalle de Material</Text>
        <Text style={styles.emptyText}>No se recibió información.</Text>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const compartirReporte = () => {
    Alert.alert("Compartir reporte", "Revise el reporte antes de compartir. ¿Desea continuar?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Compartir",
          onPress: async () => {
            Vibration.vibrate(100);

            await Share.share({
              message: material.reporte || "Sin reporte generado",
            });
          },
        },
      ]
    );
  };

  const eliminarMaterial = () => {
    Alert.alert( "Eliminar reporte", "¿Está seguro que desea eliminar este reporte?",
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
              await deleteDoc(doc(db, "materiales", material.id));
              Alert.alert( "Eliminado", "El reporte fue eliminado correctamente" );

              navigation.navigate("HistorialMateriales");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el reporte");
              console.log(error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Detalle de Material</Text>
          <Text style={styles.subtitle}>Reporte operativo guardado</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {material.tipoRegistro || "Registro"}
          </Text>
        </View>

        <Text style={styles.category}>
          {material.categoria || "Sin categoría"}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fecha</Text>
          <Text style={styles.infoValue}>
            {material.fechaRegistro || "Sin fecha"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hora</Text>
          <Text style={styles.infoValue}> {material.horaRegistro || "Sin hora"} </Text>
        </View>
      </View>

      <View style={styles.reportCard}>
        <Text style={styles.sectionTitle}>Reporte generado</Text>

        <View style={styles.reportBox}>
          <Text style={styles.reportText}> {material.reporte || "Sin reporte disponible"} </Text>
        </View>
      </View>

      {material.fotoGuia && (
        <View style={styles.imageCard}>
          <Text style={styles.sectionTitle}>Foto de guía</Text>
          <Image source={{ uri: material.fotoGuia }} style={styles.image} />
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.shareButton} onPress={compartirReporte}>
          <Text style={styles.buttonText}>Compartir Reporte</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={eliminarMaterial}>
          <Text style={styles.buttonText}>Eliminar Reporte</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DetalleMaterialScreen;

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

  header: {
    marginTop: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 5,
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

  category: {
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
  },

  reportCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
  },

  reportBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  reportText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
  },

  imageCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 15,
    elevation: 5,
    marginBottom: 18,
  },

  image: {
    width: "100%",
    height: 230,
    borderRadius: 14,
    resizeMode: "cover",
  },

  actions: {
    marginTop: 5,
  },

  shareButton: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  deleteButton: {
    backgroundColor: "#dc2626",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  backButton: {
    backgroundColor: "#0f172a",
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

  emptyText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginVertical: 20,
  },
});