package com.example.modernapp;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

/**
 * Adapter for the RecyclerView to display items
 */
public class ItemAdapter extends RecyclerView.Adapter<ItemAdapter.ViewHolder> {
    
    private Context context;
    private List<DataManager.ItemModel> itemList;
    private OnItemClickListener listener;
    
    // Interface for item click events
    public interface OnItemClickListener {
        void onItemClick(int position);
    }
    
    public ItemAdapter(Context context, List<DataManager.ItemModel> itemList) {
        this.context = context;
        this.itemList = itemList;
    }
    
    public void setOnItemClickListener(OnItemClickListener listener) {
        this.listener = listener;
    }
    
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.list_item, parent, false);
        return new ViewHolder(view);
    }
    
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        DataManager.ItemModel item = itemList.get(position);
        
        holder.imageViewItem.setImageResource(item.getIconResource());
        holder.textViewTitle.setText(item.getTitle());
        holder.textViewDescription.setText(item.getDescription());
    }
    
    @Override
    public int getItemCount() {
        return itemList.size();
    }
    
    public class ViewHolder extends RecyclerView.ViewHolder {
        ImageView imageViewItem;
        TextView textViewTitle;
        TextView textViewDescription;
        
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            
            imageViewItem = itemView.findViewById(R.id.itemImage);
            textViewTitle = itemView.findViewById(R.id.itemTitle);
            textViewDescription = itemView.findViewById(R.id.itemDescription);
            
            // Set up click listener
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (listener != null) {
                        int position = getAdapterPosition();
                        if (position != RecyclerView.NO_POSITION) {
                            listener.onItemClick(position);
                        }
                    }
                }
            });
        }
    }
}