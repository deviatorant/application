package com.example.modernapp;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.button.MaterialButton;

import java.util.List;

/**
 * Adaptateur pour le RecyclerView, permettant d'afficher la liste d'éléments
 */
public class ItemAdapter extends RecyclerView.Adapter<ItemAdapter.ItemViewHolder> {

    private final List<DataManager.Item> items;
    private final Context context;
    private final OnItemClickListener listener;

    // Interface pour gérer les clics sur les éléments
    public interface OnItemClickListener {
        void onItemClick(DataManager.Item item, int position);
        void onActionButtonClick(DataManager.Item item, int position);
    }

    // Constructeur
    public ItemAdapter(Context context, List<DataManager.Item> items, OnItemClickListener listener) {
        this.context = context;
        this.items = items;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ItemViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.list_item, parent, false);
        return new ItemViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ItemViewHolder holder, int position) {
        DataManager.Item item = items.get(position);
        holder.bind(item, position, listener);
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    // ViewHolder pour les éléments de la liste
    static class ItemViewHolder extends RecyclerView.ViewHolder {
        TextView titleTextView;
        TextView descriptionTextView;
        MaterialButton actionButton;

        ItemViewHolder(@NonNull View itemView) {
            super(itemView);
            titleTextView = itemView.findViewById(R.id.itemTitle);
            descriptionTextView = itemView.findViewById(R.id.itemDescription);
            actionButton = itemView.findViewById(R.id.itemActionButton);
        }

        void bind(final DataManager.Item item, final int position, final OnItemClickListener listener) {
            titleTextView.setText(item.getTitle());
            descriptionTextView.setText(item.getDescription());

            // Gestion des clics sur l'élément entier
            itemView.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onItemClick(item, position);
                }
            });

            // Gestion des clics sur le bouton d'action
            actionButton.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onActionButtonClick(item, position);
                }
            });
        }
    }
}